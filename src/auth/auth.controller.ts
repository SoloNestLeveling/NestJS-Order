import { Body, Controller, Get, Headers, Post, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateOwnerDto } from 'src/owners/dto/create-owner.dto';
import { CreateReadStreamOptions } from 'fs/promises';
import { CreateRiderDto } from 'src/riders/dto/create-rider.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }



  @Post('register/user/email')
  registerUser(
    @Body() dto: CreateUserDto
  ) {
    return this.authService.registerUserWithEmail(dto);
  };


  @Post('register/owner/email')
  registerOwner(
    @Body() dto: CreateOwnerDto
  ) {
    return this.authService.registerOwnerWithEmail(dto);
  };


  @Post('register/rider/email')
  registerRider(
    @Body() dto: CreateRiderDto
  ) {
    return this.authService.registerRiderWithEmail(dto);
  };




  @Post('login/user/email')
  loginUser(
    @Headers('authorization') rawToken: string
  ) {
    return this.authService.UserloginWithToken(rawToken);
  };


  @Post('login/owner/email')
  loginOwner(
    @Headers('authorization') rawToken: string
  ) {
    return this.authService.OwnerloginWithToken(rawToken);
  };


  @Post('login/rider/email')
  loginRider(
    @Headers('authorization') rawToken: string
  ) {
    return this.authService.RiderloginWithToken(rawToken);
  };





}
