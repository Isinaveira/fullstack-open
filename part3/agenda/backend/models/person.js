const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'El nombre debe tener al menos 3 caracteres de longitud'],
    required: [true, 'El nombre es obligatorio']
  },
  number: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    validate: {
      validator: function(v) {
        return /^\d{1,3}-\d+$/.test(v);
      }
    }
  },
});

const Person = mongoose.model("Person", personSchema);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
})


module.exports = {
  Person
}