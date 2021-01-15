export default class validator{
    static register = (must = true)=>({
        name: {
            presence: must,
            type: "string",
          },

          email: {
            presence:must,
            type: "string",
          },
          password:{
            presence:must,
            type:"string"
          },
          useType: {
            presence:must,
            type: "string",
          }
    })

    static verify = (must = true)=>({
      otp: {
          presence: must,
          type: "string",
        }
  })

  static verifyNewEmail = (must = true)=>({
    otp: {
        presence: must,
        type: "string",
      },
      newPassword:{
        presence:must,
        type:"string"
      },
      newEmail:{
        presence:must,
        type:"string"
      }
})

  static login = (must = true)=>({
    email: {
        presence: must,
        type: "string",
      },
      password: {
        type: "string",
      }
})

static changeEmail = (must = true)=>({
  newEmail:{
    presence:must,
    type:"string"
  }
})

static changePassword = (must = true)=>({
  newPassword:{
    presence:must,
    type:"string"
  },
  otp:{
    presence:must,
    type:"string"
  }
})

static createContact = (must = true)=>({
  contact: {
      presence: must,
      type: "array",
    }
})

static createList = (must = true)=>({
  contact: {
      presence: must,
      type: "array",
    },
  name:{
    presence:must,
    type:"string"
  }
})

static deleteContactFromList = (must = true)=>({
  contactIds: {
      presence: must,
      type: "array",
    }
})

static sendMail = (must = true)=>({
  emails: {
      type: "array",
    },
    subject: {
      presence: must,
      type: "string",
    },
    body: {
      presence: must,
      type: "string",
    },
    contactIds: {
      type: "array",
    },
    listIds: {
      type: "array",
    },
})

static sendScheduledMail = (must = true)=>({
  emails: {
      presence: must,
      type: "array",
    },
    subject: {
      presence: must,
      type: "string",
    },
    body: {
      presence: must,
      type: "string",
    },
    timeStamp:{
      presence:must,
      type:"string"
    },
    name:{
      presence:must,
      type:"string"
    }
})
    

static cancelTask = (must = true)=>({
  taskName: {
      presence: must,
      type: "string",
    }
})

static emailTemplate = (must = true)=>({
  
    title: {
      presence: must,
      type: "string",
    },
    body: {
      presence: must,
      type: "string",
    }
})
}