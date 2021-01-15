import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import { EmailPurchases } from "./emailPurchases";

@Entity()
export class EmailOffer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    title: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    emailAmount: number;

    @Column()
    discount: string;

    @Column()
    discountPrice: string;

    @Column({default:true})
    active: boolean;
    
    @OneToMany((type)=>EmailPurchases, (emailPurchases)=>emailPurchases.offer)
    emailPurchases:EmailPurchases[]
}

