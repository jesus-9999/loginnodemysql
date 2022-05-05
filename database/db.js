
const mysql=require('mysql');


const conexion=mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE    
});

conexion.connect((error)=>{
    if (error) {
        console.log('error en la base de datos: '+error);
        return
    }
    console.log('conexion a la base de datos = true')
})

module.exports=conexion;