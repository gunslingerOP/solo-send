import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class Otp extends BaseEntity {

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
    expired: boolean;

    @Column()
    used: boolean;

    @Column()
    type: string;

    @Column()
    code: string;




    @ManyToOne((type)=>User, (User)=>User.otp)
    user: User

}
