import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class emailOffer extends BaseEntity {

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

}
