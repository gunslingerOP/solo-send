import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne} from "typeorm";
import { emailOffer } from "./emailOffer";
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
    expiry: number;

    @Column()
    price: string;




    @ManyToOne((type)=>User, (User)=>User.emailPurchases)
    user: User

    @OneToOne(() => emailOffer)
    @JoinColumn()
    emailOffer: emailOffer;

}
