import {db} from './models'
const Role = db.role; 

const initial = async () => {
  try {
    let count = await Role.estimatedDocumentCount()
    if (count === 0) {
      let user = new Role({  name: "user" })
      await user.save()
      console.log("added 'user' to roles collection");
      let moderator = new Role({  name: "moderator"})
      await moderator.save()
      console.log("added 'moderator' to roles collection");
      let admin = new Role({ name: "admin"})
      await admin.save()
      console.log("added 'admin' to roles collection");
    } 
  } catch (err) {
        console.log("error", err)
  }
    
}

export { initial }