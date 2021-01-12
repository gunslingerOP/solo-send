import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import { Contact } from "./contact";
import { Subscription } from "./subscription";
import { User } from "./User";

@Entity()
export class Plan extends BaseEntity {

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
    type: string;

    @Column()
    price: string;

    @Column()
    description: string;

    @Column()
    emailsAllowed: number;

    @Column()
    discount: string;

    @Column()
    discountPrice: string;

    @Column()
    active: boolean;

    @OneToMany((type)=>Subscription, (subscription)=>subscription.plan)
    subscription: Subscription[]

    @OneToMany((type)=>User, (User)=>User.plan)
    users: User[]

}
