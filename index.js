async function query(db_driver, exec, sql, params) {
	params = params || [];
	return new Promise((resolve, reject) => {
		if(db_driver === 'oracle') {
			sql = sql.replace(/\$/g, ':')
		}
		exec(sql, params, (err, results) => {
			if(err) {
				console.error('Failure to run query', err);
				return reject(err)
			}
			if(results.metaData) {
				results.rows = results.rows.map((x) => { 
					let obj = {};
					x.forEach((c, i) => {
						obj[results.metaData[i].name.toLowerCase()] = c;
					});
					return obj;
				})
			}
			resolve(results.rows)
		});
	})
}
module.exports = async function(db_driver, user, pass, host, port, db, ssl) {
	return new Promise((conn_resolve, conn_reject) => {
		let driver = null;
		let client = null;
		let exec = null;
		if(db_driver === 'oracle' || db_driver === 'oracledb') {
			driver = require('oracledb');
			driver.getConnection( {
				user          : user,
				password      : pass,
				connectString : host + ":" + port + "/" + db
			},
			function(err, connection)
			{
				if(err) {
					return conn_reject(err)
				}
				driver = connection
				exec = connection.execute.bind(connection)
				conn_resolve(query.bind(query, db_driver, exec))
			})
		} else {
			driver = require('pg-pool');
			const config = {
			  user: user,
			  password: pass,
			  host: host,
			  port: port,
			  database: db,
			  ssl: ssl ? true : false
			}
			let pool = new driver(config);
			pool.connect().then(client => {
				client.release();
				exec = pool.query.bind(pool);
				conn_resolve(query.bind(query, db_driver, exec))
			}).catch((e) => {
				conn_reject(e)
			})
		}
	})
}