import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne} from "typeorm";
import { EmailOffer } from "./emailOffer";
import { User } from "./User";

@Entity("EmailPurchases")
export class EmailPurchases extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    amountPurchased: number;

    @Column()
    price: number;




    @ManyToOne((type)=>User, (User)=>User.emailPurchases)
    user: User

    @ManyToOne((type)=>EmailOffer,(offer) => offer.emailPurchases)
    offer: EmailOffer;

}
