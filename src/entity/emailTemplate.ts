import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import { User } from "./User";

@Entity()
export class EmailTemplate extends BaseEntity {

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
    title: string;

    @Column()
    active: boolean;


    @ManyToOne((type)=>User, (User)=>User.emailTemplate)
    user: User
}
