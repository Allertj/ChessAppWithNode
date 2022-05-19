import mongoose, {Model, Schema, Document} from "mongoose";

interface RoleModel extends Document{ 
    name: String,
    type: mongoose.Schema.Types.ObjectId,
    // ref: "Role"
}

const RoleSchema = new Schema<RoleModel>({
  name: String,
  type: mongoose.Schema.Types.ObjectId,
  // ref: "Role"

})

const Role = mongoose.model<RoleModel>("Role", RoleSchema);

export type {RoleModel}
export { Role }