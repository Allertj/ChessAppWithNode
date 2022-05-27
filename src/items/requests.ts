const makePOSTRequest = (address: string, body: any, callback: (data: any)=> void, attr: string) => {  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    fetch(address, requestOptions)
      .then(response => response.json())
      .catch(callback)   
      .then(data => { 
        if (attr) { callback(data[attr]) } 
        else { callback(data)}})      
  }
  
const makeGETRequest = (address: string, callback: (data: any) => void, attr: string) => {  
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(address, requestOptions)
      .then(response => response.json() )
      .then(data => { 
        if (attr) { callback(data[attr]) } 
        else { callback(data)}});         
  }

  const makeGETRequestAuth = (address: string, callback: (data: any) => void, attr: string, token: string) => {  
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                 "x-access-token": token}
    };
    // console.log("requestoptions", requestOptions);
    fetch(address, requestOptions)
      .then(response => response.json() )
      .then(data => { 
        if (attr) { callback(data[attr]) } 
        else { callback(data)}});         
  }

  const makePOSTRequestAuth = (address: string, body :string, callback: (data: any)=> void, attr: string, token: string) => {  
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 "x-access-token": token},
      body: JSON.stringify(body)
    };
    fetch(address, requestOptions)
      .then(response => response.json())
      .then(data => { 
        if (attr) { callback(data[attr]) } 
        else { callback(data)}})
         
  }

export { makeGETRequest, makePOSTRequest, makeGETRequestAuth, makePOSTRequestAuth}
