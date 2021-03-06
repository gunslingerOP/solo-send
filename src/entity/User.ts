import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    BaseEntity,
    ManyToOne,
    JoinTable,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Contact } from "./contact";
import { ContactsList } from "./contactsList";
import { EmailPurchases } from "./emailPurchases";
import { EmailTemplate } from "./emailTemplate";
import { Otp } from "./otp";
import { Plan } from "./plan";
import { ScheduledMail } from "./scheduled";
import { SentEmail } from "./sentEmail";
import { Subscription } from "./subscription";
  
  
  @Entity("user")
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column()
    name: string;
  
    @Column()
    email: string;
  
    @Column()
    verified: boolean;

    @Column()
    useType: string; // what the user is using the platform for

    @Column()
    active: boolean;
  
    @Column()
    planType: number;

    @Column()
    planId: number;

    @Column()
    emailsLeft: number;

    @Column({nullable:true})
    emailsSentToday: number;

    @Column({nullable:true})
    dailyLimit: number;

    @Column({nullable:true})
    cancellations: number;
    

    @Column({nullable:true})
    exceededDailyLimit: boolean;
  
    //-----------------------RELATIONS-----------------------
  
   @OneToMany((type)=>EmailPurchases, (emailPurchases)=>emailPurchases.user)
    emailPurchases:EmailPurchases[]

    @OneToMany((type)=>SentEmail, (sentEmail)=>sentEmail.user)
    sentEmail:SentEmail[]

    @OneToMany((type)=>Otp, (Otp)=>Otp.user)
    otp:Otp[]

    @OneToMany((type)=>ScheduledMail, (mail)=>mail.user)
    scheduledMail:ScheduledMail[]

    @OneToMany((type)=>Contact, (contact)=>contact.user)
    contact:Contact[]

    @OneToMany((type)=>EmailTemplate, (EmailTemplate)=>EmailTemplate.user)
    emailTemplate:EmailTemplate[]

    @OneToMany((type)=>ContactsList, (ContactsList)=>ContactsList.user)
    contactsList:ContactsList[]

    @OneToMany((type)=>Subscription, (subscription)=>subscription.user)
    subscription:Subscription[]



   
  }
  