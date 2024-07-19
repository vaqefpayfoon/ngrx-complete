export interface Notes {
    from: From;
    texts: Text[];
}

export interface From {
    accountUuid: string;
    identity: Identity;
}

export interface Text {
    uuid: string;
    value: string;
    isEdited: boolean;
    dateAndTime: Date;
}
export interface SortedText {
    accountUuid: string;
    fullName: string;
    salutation: string;
    uuid: string;
    value: string;
    isEdited: boolean;
    dateAndTime: Date;
}
export interface Identity {
    fullName: string;
    salutation: string;
}
export interface ISaveNote {
    uuid: string;
    note: string;
}