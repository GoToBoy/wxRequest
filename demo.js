import $req from './request'

//demo
$req('xxurl',data,{method:'GET',showLoading:false,needWxCode:false,needAuthLogin:true,autoCatch:true}).then(data=>{
  console.log(data)
})

//config
- showLoading
- needWxCode
