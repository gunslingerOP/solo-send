import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Admin extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({nullable:true})
    phone: string;


    @Column()
    type: number;

}
