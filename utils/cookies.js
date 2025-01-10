const sendCookies = (name, value, res) => {
  const developmentOptions = {
    domain: 'localhost',
    httpOnly: true,
    expires: new Date(Date.now() + 2592000000), 
    sameSite: "lax", 
    secure: false    
  }
  
  const productionOptions = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 2592000000),
    sameSite: 'none',
    path: "/"
  }
  
  res.cookie(name, value, 
    process.env.NODE_ENV === 'DEVELOPMENT' 
      ? developmentOptions 
      : productionOptions
  );
}


export default sendCookies 