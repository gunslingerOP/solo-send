import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany, ManyToOne} from "typeorm";
import { Contact } from "./contact";
import { Plan } from "./plan";
import { User } from "./User";

@Entity()
export class Subscription extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    expiry: number;

    @Column()
    expired:boolean;

    @Column({nullable:true})
    cancelled:boolean;

    @Column()
    planId: number


    @ManyToOne((type)=>User, (user)=>user.subscription)
    user: User
}
