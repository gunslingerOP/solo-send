import { errRes, okRes, paginate } from "../helpers/tools"
import { Contact } from "../src/entity/contact"
import { ContactsList } from "../src/entity/contactsList"
import { EmailTemplate } from "../src/entity/emailTemplate"
import { SentEmail } from "../src/entity/sentEmail"
import { Subscription } from "../src/entity/subscription"

export default class DataController{
    static getContacts=async(req,res)=>{
        let user = req.user
        let contacts
        let { p, s } = req.query;

        let { skip, take } = paginate(p, s);
        contacts = await Contact.findAndCount({
            skip,
            take,
            where:{user, active:true}})

            if(!contacts) return errRes(res,`No contacts found`)

            return okRes(res, contacts)

    }

    static getLists=async(req,res)=>{
        let user = req.user
        let lists
        let { p, s } = req.query;

        let { skip, take } = paginate(p, s);
        lists = await ContactsList.findAndCount({
            skip,
            take,
            where:{user, active:true},
            join: {
                alias: "list",
                leftJoinAndSelect: {
                  contacts: "list.contact",
                },
              },        
        })

            if(!lists) return errRes(res,`No lists found`)

            return okRes(res, lists)

    }

    static sentEmails=async(req,res)=>{
        let user = req.user
        let emails
        let { p, s } = req.query;

        let { skip, take } = paginate(p, s);
        emails = await SentEmail.findAndCount({
            skip,
            take,
            where:{user},
            join: {
                alias: "email",
                leftJoinAndSelect: {
                  lists: "email.contactsList",
                    contacts:"email.contact"
                },
              },        
        })

            if(!emails) return errRes(res,`No emails found`)

            return okRes(res, emails)

    }

    static getTemplates=async(req, res)=>{
        let body = req.body
        let template
        let user= req.user
        let { p, s } = req.query;

        let { skip, take } = paginate(p, s);
    
        template = await EmailTemplate.findAndCount({
            skip,
            take,
            where:{user},
                 
        })
        if(!template) return errRes(res,`No template found`)
      

        return okRes(res,template)
      
      
      }

      static getSubscription=async(req, res)=>{
        let subscription
        let user= req.user

    
        subscription = await Subscription.find({
    
            where:{user, expired:false, cancelled:false},
                 
        })
        if(!subscription) return errRes(res,`No subscription found`)
      

        return okRes(res,subscription)
      
      
      }
}