using { wekan.mongo.db as wekan } from '../db/wekan-model';

service WekanBoard @(path: '/odata/wekan/boards') {
    entity Boards as projection on wekan.Boards;
}