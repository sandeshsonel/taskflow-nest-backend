import { Controller, Get, Post, Patch, Delete, Body, Query, Param, ParseIntPipe, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { GetUser } from '@common/decorators/get-user.decorator';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Task')
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get task by ID' })
    getTaskById(
        @Param('id') id: string,
        @GetUser() user: JwtPayload
    ) {
        return this.taskService.getTaskById(id, user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get task list' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'isAdmin', required: false, type: Boolean })
    getTaskList(
        @GetUser() user: JwtPayload,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('isAdmin', new DefaultValuePipe(false), ParseBoolPipe) isAdmin: boolean,
    ) {
        return this.taskService.getTaskList(user, page, limit, isAdmin);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiQuery({ name: 'adminUser', required: false, type: Boolean })
    createTask(
        @GetUser() user: JwtPayload,
        @Body() createTaskDto: CreateTaskDto,
        @Query('adminUser', new DefaultValuePipe(false), ParseBoolPipe) adminUser: boolean,
    ) {
        return this.taskService.createTask(user, createTaskDto, adminUser);
    }

    @Patch()
    @ApiOperation({ summary: 'Update a task' })
    @ApiQuery({ name: 'taskId', required: true })
    @ApiQuery({ name: 'adminId', required: false })
    updateTask(
        @GetUser() user: JwtPayload,
        @Query('taskId') taskId: string,
        @Query('adminId') adminId: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.taskService.updateTask(user, taskId, updateTaskDto, adminId);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete a task' })
    @ApiQuery({ name: 'taskId', required: true })
    deleteTask(
        @GetUser() user: JwtPayload,
        @Query('taskId') taskId: string,
    ) {
        return this.taskService.deleteTask(user, taskId);
    }
}
