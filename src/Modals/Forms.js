import React from "react";
import images from '../Constants/images';
import Success from '../assets/success.png';


export const Signedinmodal = ()=> {
       return(   
           <div style={{zIndex: "5000", top: "10%", right: "10%"}} className=" fixed">
      <div className="max-lg:hidden"><img src={Success} width={120} alt="success_image" /></div>
      <div className="hidden max-lg:block"><img src={Success} width={70} alt="success_image" /></div>
</div>
       )
    }

export const Signeduperror = ()=> {
       return(   
           <div className="login-modal flex gap-2">
      <h1 className="text-center text-xl text-green-700">Please fill every available field with the required information!</h1>
      <div><img src={images.picture.sent} width={20} alt="success_image" />
</div>
    </div>
       )
    } 

export const Unauthorizedpasswordmodal = ()=> {
       return(   
           <div className="login-modal  flex gap-2">
      <h1 className="text-center text-xl text-green-700">Incorrect  Password</h1>
    </div>
       )
    
    }

export const Unexistingusermodal = ()=> {
       return(   
           <div className="login-modal  flex gap-2">
      <h1 className="text-center text-xl text-green-700">User does not exist </h1>
    </div>
       )
    
    }
export const Existingusermodal = ()=> {
       return(   
           <div className="login-modal  flex gap-2">
      <h1 className="text-center text-xl text-green-700">User already exists </h1>
    </div>
       )
    
    }
export const Networkerrormodal = ()=> {
       return(   
           <div className="login-modal flex gap-2">
      <h1 className="text-center text-xl text-green-700"><strong>Connection Problems: </strong>Please refresh your network </h1>
    </div>
       )
    
    }
export const Forgotpasswordmodal = ()=> {
       return(   
           <div className="login-modal  flex gap-2">
      <h1 className="text-center text-xl text-green-700">A Password reset link has been sent to your email address. please check your email to login with new password </h1>
    </div>
       )
    
    }
export const Resetpasswordexpired = ()=> {
       return(   
           <div className="login-modal   flex gap-2">
      <h1 className="text-center text-xl text-green-700">The Reset Password link has expired. please try again at ForgotPassword.</h1>
    </div>
       )
    
    }
export const Passwordupdated = ()=> {
       return(   
           <div className="login-modal flex gap-2">
      <h1 className="text-center text-xl text-green-700">Your Password has been updated. please login with your new password.</h1>
    </div>
       )
    
    }
    export const Tokenerrormodal = ()=> {
        return(   
            <div className="login-modal  flex gap-2">
       <h1 className="text-center text-xl text-green-700">Timeout!  Please sign in to your account again</h1>
       <div><img src={images.picture.sent} width={20} alt="success_image" />
 </div>
     </div>
        )
     }
