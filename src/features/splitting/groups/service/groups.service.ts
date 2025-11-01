import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateGroupDto, AddMembersDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { PrismaService } from '../../../../prisma.service';

/**
 * Service responsible for handling group-related operations
 * @class GroupsService
 */
@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Adds a member to a group
   * @param {number} group_id - The ID of the group
   * @param {number} user_id - The ID of the user to add
   * @param {boolean} [is_admin=false] - Whether the user should be an admin
   * @returns {Promise<any>} The created group member record
   * @throws {Error} If group_id or user_id is not provided
   */
  async addMember(
    group_id: number,
    user_id: number,
    is_admin: boolean = false,
  ) {
    if (!group_id || !user_id) {
      throw new Error('Group ID and User ID are required');
    }
    const group = await this.prisma.group_members.create({
      data: {
        group_id: group_id,
        user_id: user_id,
        is_admin: is_admin,
      },
    });
    return group;
  }

  /**
   * Creates a new group and adds the creator as an admin member
   * @param {CreateGroupDto} createGroupDto - The group creation data
   * @param {number} user_id - The ID of the user creating the group
   * @returns {Promise<any>} The created group
   */
  async create(createGroupDto: CreateGroupDto, user_id: number) {
    try {
      const group: any = await this.prisma.groups.create({
        data: {
          name: createGroupDto.name,
          description: createGroupDto.description,
          created_by: user_id,
        },
      });

      if (group.group_id) {
        await this.addMember(group.group_id, user_id, true);
      }
      return group;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Retrieves the balance information for a specific group
   * @param {number} group_id - The ID of the group
   * @returns {Promise<any>} The group's balance information
   */
  async balance(group_id: number) {
    const group = await this.prisma.group_balances.findMany({
      where: {
        group_id: group_id,
      },
    });
    return group;
  }

  /**
   * Retrieves all groups for a specific user
   * @param {number} user_id - The ID of the user
   * @returns {Promise<any>} List of groups the user is a member of
   */
  findAll(user_id: number) {
    const groups = this.prisma.groups.findMany({
      where: {
        created_by: user_id,
      },
    });
    return groups;
  }

  /**
   * Retrieves a specific group by ID with its members
   * @param {number} id - The ID of the group to find
   * @param {number} user_id - The ID of the user making the request
   * @returns {Promise<any>} The group with its members
   * @throws {Error} If group ID is not provided
   */
  findOne(id: number, user_id: number) {
    if (!id) {
      throw new Error('Group ID is required');
    }
    const group = this.prisma.groups.findUnique({
      where: {
        group_id: id,
        created_by: user_id,
      },
      include: {
        members: true,
      },
    });
    return group;
  }

  /**
   * Updates a group's information
   * @param {number} id - The ID of the group to update
   * @param {UpdateGroupDto} updateGroupDto - The data to update
   * @param {number} user_id - The ID of the user making the request
   * @returns {Promise<any>} The updated group
   * @throws {Error} If group ID is not provided
   */
  update(id: number, updateGroupDto: UpdateGroupDto, user_id: number) {
    if (!id) {
      throw new Error('Group ID is required');
    }
    const group = this.prisma.groups.update({
      where: {
        group_id: id,
        created_by: user_id,
      },
      data: updateGroupDto,
    });
    return group;
  }

  /**
   * Deletes a group
   * @param {number} id - The ID of the group to delete
   * @param {number} user_id - The ID of the user making the request
   * @returns {Promise<any>} The deleted group
   */
  remove(id: number, user_id: number) {
    const group = this.prisma.groups.delete({
      where: {
        group_id: id,
        created_by: user_id,
      },
    });
    return group;
  }
}
