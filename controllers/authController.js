const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const db =require('../database/db');

const {promisify}=require('util');
const conexion = require('../database/db');
const { Console } = require('console');


exports.register=async(req,res)=>{
    const nombre=req.body.nombre;
    const username=req.body.nombreUsuario;


    db.query('INSERT INTO  usuarios set ?',{   nombre_usuario:nombre ,  user_usuario:username ,  pass_usuario:'uwu'},(error,results)=>{
        if (error) {console.log(error)};
        res.redirect('/')
    })
    console.log(nombre+'-'+username);
}


exports.login=async(req,res)=>{

    try {
        const username=req.body.user;
        const pass=req.body.pass;

        if (!username||!pass) {
            res.render('login',{
                alert:true,
                alertTitle:"Advertencia",
                alertMessage:"ingrese usuario y password",
                alertIcon:'info',
                showConfirmButton:true,
                timer:false,
                ruta:'login'
            })
            
        }else{
            var sql = 'SELECT * FROM usuarios WHERE nombre_usuario = ? AND pass_usuario= ? ';
            //Send an array with value(s) to replace the escaped values:
            db.query(sql, [username, pass], function (err, result) {
              if (err) throw err;
              

              if (result==""||result==null) {
                res.render('login',{
                    alert:true,
                    alertTitle:"Advertencia",
                    alertMessage:"no se encontro un usuario con este tipo de credenciaes",
                    alertIcon:'info',
                    showConfirmButton:true,
                    timer:false,
                    ruta:'login'
                })
              }else{
             
                const id_user=result[0].id_usuario;
                const token=jwt.sign({id:id_user},process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_TIME_END
                })
                console.log('token:'+token+'para el usuario'+result[0].nombre_usuario)
                const cookieOptions={
                    httpOnly:true
                }
                res.cookie('jwt',token,cookieOptions);
                res.render('login',{
                    alert:true,
                    alertTitle:"Conexion exitosa",
                    alertMessage:"Datos correctos",
                    alertIcon:'success',
                    showConfirmButton:false,
                    timer:800,
                    ruta:''
                });
              };
            });
        };
    } catch (error) {
        console.log('r'+error);
    };

};



exports.isauth=async(req,res,next)=>{

        if (req.cookies.jwt) {
            try {
                const decodificada=await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
                db.query('SELECT * FROM usuarios WHERE id_usuario = ?',[decodificada.id_usuario],(error,result)=>{
                    if (!result) {return next()
                    };
                    req.user=result[0];
                    return next();
                })
            } catch (error) {
                console.log(error)
               
            }

        }else{
            res.redirect('/login')
        }

}


exports.logout=async(req,res)=>{
    res.clearCookie('jwt');
    return res.redirect('/login')
}