// src/modules/iot/device/device.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IoTDevice } from '../entities/iot-device.entity';
import { RegisterDeviceDto } from '../dto/register-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(IoTDevice)
    private readonly deviceRepo: Repository<IoTDevice>,
  ) {}

  async register(dto: RegisterDeviceDto): Promise<IoTDevice> {
    const existing = await this.deviceRepo.findOne({
      where: { deviceCode: dto.deviceCode },
    });
    if (existing) {
      throw new ConflictException('Ce code de device est déjà enregistré');
    }

    const device = this.deviceRepo.create({
      parcelId: dto.parcelId,
      deviceCode: dto.deviceCode,
      deviceType: dto.deviceType ?? 'SOIL_SENSOR',
      firmwareVersion: dto.firmwareVersion ?? null,
      active: true,
    });

    return this.deviceRepo.save(device);
  }

  async findByCode(deviceCode: string): Promise<IoTDevice> {
    const device = await this.deviceRepo.findOne({ where: { deviceCode } });
    if (!device) throw new NotFoundException('Device introuvable');
    return device;
  }

  async findByParcel(parcelId: string): Promise<IoTDevice[]> {
    return this.deviceRepo.find({ where: { parcelId } });
  }

  async updateLastSeen(deviceId: string, batteryLevel?: number): Promise<void> {
    await this.deviceRepo.update(deviceId, {
      lastSeenAt: new Date(),
      ...(batteryLevel !== undefined && { batteryLevel }),
    });
  }
}
