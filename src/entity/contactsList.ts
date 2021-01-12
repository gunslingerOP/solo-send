import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from "typeorm";
import { Contact } from "./contact";
import { SentEmail } from "./sentEmail";
import { User } from "./User";

@Entity()
export class ContactsList extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    opens: string;

    @Column()
    name: string;

    @Column()
    unsubscribers: string;

    @Column()
    active: boolean;

    @Column()
    subscribers: number;



    @OneToMany((type)=>Contact, (contact)=>contact.contactList)
    contact: Contact[]

    @OneToMany((type)=>SentEmail, (sentEmail)=>sentEmail.contactsList)
    sentEmail: ContactsList[]

    @ManyToOne((type)=>User, (user)=>user.contactsList)
    user: User

}
