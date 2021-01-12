import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import { Contact } from "./contact";
import { ContactsList } from "./contactsList";
import { User } from "./User";

@Entity()
export class SentEmail extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    body: string;

    @Column()
    subject: string;

    @Column({nullable:true})
    scheduledAt: Date;



    @ManyToOne((type)=>User, (User)=>User.sentEmail)
    user:User

    @ManyToOne((type)=>ContactsList, (contactsList)=>contactsList.sentEmail)
    contactsList:ContactsList

    @ManyToOne((type)=>Contact, (contact)=>contact.sentEmail)
    contact:Contact

}
