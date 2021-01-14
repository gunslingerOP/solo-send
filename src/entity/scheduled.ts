import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import { Contact } from "./contact";
import { ContactsList } from "./contactsList";
import { User } from "./User";

@Entity()
export class ScheduledMail extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column({nullable:true})
    scheduledAt: Date;

    @Column({nullable:true})
    taskName: string;

    @Column({nullable:true})
    active: boolean;



    @ManyToOne((type)=>User, (User)=>User.scheduledMail)
    user:User



}
