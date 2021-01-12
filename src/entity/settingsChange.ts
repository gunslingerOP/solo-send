import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    BaseEntity,
    ManyToOne,
    JoinTable,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";

  
  
  @Entity()
  export class SettingsChange extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
      
    @Column()
    enablePhone: boolean;
  
    @Column()
    adminId: number;

    @Column()
    active: boolean;
  
   
  }