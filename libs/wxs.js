//微信接口封装导出promisify，不想写wx.xxx
import Promisify from './libs/promisify';

module.exports = (api)=>{
  if(wx.api){
    return  Promisify(wx.api) ;
  } 
  
  
}
