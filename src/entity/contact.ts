import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from "typeorm";
import { ContactsList } from "./contactsList";
import { SentEmail } from "./sentEmail";
import { User } from "./User";

@Entity()
export class Contact extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({nullable:true})
    firstName: string;

    @Column({nullable:true})
    lastName: string;

    @Column()
    email: string;

    @Column({nullable:true})
    active: boolean;


    @ManyToOne((type)=>ContactsList, (contactsList)=>contactsList.contact)
    contactList: ContactsList

    @ManyToOne((type)=>User, (User)=>User.contact)
    user: User

    @OneToMany((type)=>SentEmail, (sentEmail)=>sentEmail.contact)
    sentEmail: SentEmail[]

}
