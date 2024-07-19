import { Inject, Injectable } from '@angular/core';

// Environment
import { Environment, ENVIRONMENT } from '@neural/environment';

@Injectable({
  providedIn: 'root',
})
export class FontLoaderService {
  constructor(@Inject(ENVIRONMENT) private readonly env: Environment) {}

  get fontUrls(): string[] {
    return this.env.s3.fonts;
  }

  get fontList(): any[] {
    return [
      { value: 'Arial, Helvetica, sans-serif', name: 'Arial' },
      { value: 'Arial Black, Gadget, sans-serif', name: 'Arial Black' },
      { value: 'Brush Script MT, sans-serif', name: 'Brush Script MT' },
      { value: 'Comic Sans MS, cursive, sans-serif', name: 'Comic Sans MS' },
      { value: 'Courier New, Courier, monospace', name: 'Courier New' },
      { value: 'Georgia, serif', name: 'Georgia' },
      { value: 'Helvetica, sans-serif', name: 'Helvetica' },
      { value: 'Impact, Charcoal, sans-serif', name: 'Impact' },
      {
        value: 'Lucida Sans Unicode, Lucida Grande, sans-serif',
        name: 'Lucida Sans Unicode',
      },
      { value: 'Tahoma, Geneva, sans-serif', name: 'Tahoma' },
      { value: 'Times New Roman, Times, serif', name: 'Times New Roman' },
      { value: 'Trebuchet MS, Helvetica, sans-serif', name: 'Trebuchet MS' },
      { value: 'BMWMotorradOutlineW01-Rg', name: 'BMWMotorradOutlineW01-Rg' },
      { value: 'BMWMotorradOutlineW02-Rg', name: 'BMWMotorradOutlineW02-Rg' },
      { value: 'BMWMotorradOutlineW04-Rg', name: 'BMWMotorradOutlineW04-Rg' },
      { value: 'BMWMotorradOutlineW05-Rg', name: 'BMWMotorradOutlineW05-Rg' },
      { value: 'BMWMotorradW01', name: 'BMWMotorradW01' },
      { value: 'BMWMotorradW02', name: 'BMWMotorradW02' },
      { value: 'BMWMotorradW04', name: 'BMWMotorradW04' },
      { value: 'BMWMotorradW05', name: 'BMWMotorradW05' },
      { value: 'BMWTypeNextTT', name: 'BMWTypeNextTT' },
      { value: 'MINI Sans Serif', name: 'MINI Sans Serif' },
      { value: 'MINI Serif Headline', name: 'MINI Serif Headline' },
      { value: 'MINI Serif', name: 'MINI Serif' },
    ];
  }
}