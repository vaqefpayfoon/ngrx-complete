import {
  Component,
  Inject,
  OnInit,
  Output,
  ViewEncapsulation,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import grapesjs from 'grapesjs';
import 'grapesjs-preset-newsletter';
import { IData, Master, ITags } from '@neural/shared/data';

import { TagsComponent } from './tags/tags.component';

import { FontLoaderService } from '../../services/font-loader.service';

@Component({
  selector: 'neural-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HtmlEditorComponent implements OnInit, AfterViewInit {
  private editor: any;

  @Output() image = new EventEmitter<File>();

  @ViewChild('dialogChild', { static: true }) public dialogChild: ElementRef;

  constructor(
    private dialog: MatDialog,
    private readonly fontLoaderService: FontLoaderService,
    private dialogRef: MatDialogRef<HtmlEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IData
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeEditor();
  }

  ngAfterViewInit() {
    if (this.data?.name === Master.MASTER) {
      this.dialogChild.nativeElement.className = 'disable-upload';
    }
  }

  async initEditor() {
    this.editor = grapesjs.init({
      container: '#gjs',
      height: '100%',
      width: '100%',
      exportWrapper: 0,
      allowScripts: 1,
      mediaCondition: 'max-width',
      forceClass: false,
      plugins: ['gjs-preset-newsletter'],
      assetManager: {
        multiUpload: false,
        uploadFile: (e) => {
          const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

          this.uploadImage(files);
        },
      },
      canvas: {
        styles: this.fontLoaderService.fontUrls,
      },
    });
  }

  async loadEditor() {
    await this.editor.on('load', (editor) => {
      if (this.data && this.data?.html) {
        const document = htmlParser(this.data?.html);

        editor.setComponents(document?.bodyHTML);
        editor.setStyle(document?.styleHTML);
      }

      if (this.data && this.data?.images) {
        const am = editor.AssetManager;
        am.load({
          assets: [...this.data?.images],
        });
      }

      const fontList = this.fontLoaderService.fontList;

      const styleManager = editor.StyleManager;
      const fontProperty = styleManager.getProperty(
        'typography',
        'font-family'
      );
      fontProperty.set('list', fontList);
      styleManager.render();
    });
  }

  private async initializeEditor(): Promise<void> {
    await this.initEditor();
    await this.loadEditor();
    await this.initializeEditorConfig();
  }

  private async initializeEditorConfig() {
    const blockManager = this.editor.BlockManager;

    const blockToRemove = ['quote', 'button'];

    blockToRemove.forEach((block) => {
      const foundBlock = blockManager
        .getAll()
        .find((b) => b.attributes.id === block);

      if (foundBlock) {
        blockManager.remove(foundBlock.cid);
      }
    });

    blockManager.add('quote-block', {
      label: 'Quote',
      content: `
        <blockquote style="box-sizing: border-box; font-style: italic;">
          <span style="font-size: 150%; font-weight: bold;">&#8221;</span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit
          <span style="font-size: 150%; font-weight: bold;">&#8220;</span>
        </blockquote>
      `,
      category: 'Basic',
      attributes: {
        title: 'Insert custom quote block',
        class: 'fa fa-quote-left',
      },
    });

    blockManager.add('button-block', {
      label: 'Button',
      content: `
        <a style="box-sizing: border-box; background-color: blue; color: white; padding: 10px 20px 10px 20px;">Button</a>
      `,
      category: 'Basic',
      attributes: {
        title: 'Insert custom button block',
        class: 'fa fa-window-minimize',
      },
    });

    if (this?.data?.tag) {
      const commands = this.editor.Commands;
      const panelManager = this.editor.Panels;

      panelManager.addButton('options', {
        id: 'addCampaignTag',
        className: 'fa fa-tag',
        command: 'addCampaignTag',
        attributes: { title: 'Add Campaign Tag' },
        active: false,
      });

      commands.add('addCampaignTag', () => {
        this.addCampaignTag(this.data.tag);
      });
    }
  }

  addCampaignTag(tag: ITags) {
    this.dialog
      .open(TagsComponent, {
        disableClose: true,
        autoFocus: true,
        height: '50%',
        width: '50%',
        data: tag,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.editor.addComponents(`<span>${result.data}</span>`, { at: 0 });
        }
      });
  }

  async createNewsletter() {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    ${await this.loadFontsCss()}
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>${this.editor.getCss()}</style>
    <title>Document</title>
    </head>
    <body>
    ${this.editor.getHtml()}
    </body>
    </html>
    `;

    this.dialogRef.close({ data: htmlTemplate });
  }

  private uploadImage(files: FileList) {
    const file = files.item(files.length - 1);

    this.image.emit(file);
  }

  private async loadFontsCss(): Promise<string> {
    let link = '';
    this.fontLoaderService.fontUrls.map((x) => {
      if (x) {
        link += `<link rel="stylesheet" href="${x}">`;
      }
    });
    return link;
  }

  public async renderImage(images: string[]) {
    const am = this.editor.AssetManager;
    if (images) {
      for (const item of images) {
        await am.remove(item);
      }

      await am.add([...images]);
    }
  }
}

export function htmlParser(str: string): IParseDocument {
  const parser = new DOMParser();
  const document = parser.parseFromString(str, 'text/html') as Document;

  const styles = document.getElementsByTagName('style');

  return {
    bodyHTML: document?.body?.innerHTML,
    styleHTML: styles[0]?.innerHTML,
  };
}

export interface IParseDocument {
  bodyHTML: string;
  styleHTML: string;
}
