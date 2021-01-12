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

    @ManyToOne((type)=>Plan, (plan)=>plan.subscription)
    plan: Plan[]


    @ManyToOne((type)=>User, (user)=>user.subscription)
    user: User[]
}
