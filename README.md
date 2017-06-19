# Asyncronous Query

A simple modern query interface over oracle or postgresql database using async or await.

## Install

node 7+

```bash
$ npm install --save async-query
```

You'll then need to install your driver:

oracle:

```bash
$ npm install --save oracledb
```

or 

postgresql:

```bash
$ npm install --save pg-pool pg
```


## Example

Make a query to a database

```javascript
let driver = require('query-async')
async function go() {
	// driver('oracle|postgresql', 'username', 'password', 'hostname', port, 'database_or_servicename', ssl);
	let query = await driver('oracle','user','pass','host',1521,'db',false)
	let result = await query('select * from table where column = $1', ['param']);
	// result now contains array of objects with column names for properties.
	console.log(result) // [{'column':value}]
}
go().catch((e) => { console.log('error', e); }
```

## Support

* Update, inserts, deletes, selects
* Parameterized queries (with $1 $2 $3 etc.)
* Connection pooling

## Not supported

* Transactions
* Cursors
* Streams