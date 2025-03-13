import { Freelancer } from 'src/freelancer/entities/freelancer.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';



@Entity()
export class UserSkill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    skillId: number

    @Column("int")
    freelancerId: number
    
    @ManyToOne(type => Freelancer, freelancer =>freelancer.skills, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    freelancer: Freelancer

    @ManyToOne(type => Skill, skill =>skill.freelancer, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    skill: Skill
}