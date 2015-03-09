#Hemulen

*All around (the Hemulen) there were people living slipshod and aimless lives, wherever he looked there was something to be put to rights and he worked his fingers to the bone trying to get them to see how they ought to live.* &mdash; Tove Jansson, *Moominvalley in November*

Too many plugins make too many assumptions and offer too many features. I am really tired of these plugins. I'm tired of their over-designed branding which indicates that someone or someones have built a tool and staked their ego to it; I'm tired of their 

##Support

##Glossary

- Hemulen class instance
    + An instance of the Hemulen class created by calling the Hemulen constructor and passing an object of configuration values.
- Hemulen DOM instance
    + A Hemulen class instance can refer to more than one DOM element. 
- File List
- File Object

##Use

    <form action="" method="post" enctype="multipart/form-data">
        <div id="constable">
            <div class="hemulen__drop-field"></div>
            <input class="hemulen__file-input" type="file" name="hemulen" />
        </div>
        <input type="submit" />
    </form>
    
    
    <script type="text/javascript" src="hemulen.js"></script>
    <script>
        var theConstable = new Hemulen({
            hemulen: '#constable',
            namespace: 'constable',
            fileLimit: 10
        });
    </script>



##Config

`options.namespace`

Type: Selector string

`options.dropInput`

Type: Selector string

`options.fileInput`

Type: Selector string

`options.acceptTypes`

Type: Array of strings 

`options.fileLimit`

Type: Number

`options.fileMaxSize`

Type: Number

`options.beforeSub`

Type: Function

##Events

Hemulen events are DOM events. In addition to the properties and methods common to DOM events, a Hemulen event object contains Hemulen-specific values stored on the `event.detail` property.

###File Stored

Event Name: `hemulen-filestored`

The event emitted by the Hemulen element when a file is dropped on the drop field or uploaded through the file input and successfully stored on the data model.

Event properties:

- `hemulen-filestored.detail.file`
    + Type: File Object
    + The file object that has been successfully stored on the data model.
- `hemulen-filestored.detail.fileId`
    + Type: String
    + The key under which the file has been stored on the data model. **`fileId` should be stored for later use.** Without the value of `fileId`, the file cannot be removed from the data model or updated with additional properties. Unlike the `instanceId`, there is no method to query the data model for a `fileId`. A file whose `fileId` is unknown to the application is stranded on the data model.
- `hemulen-filestored.detail.hemulen`
    + Type: Object
    + Hemulen instance configuration
    + The Hemulen context
- `hemulen-filestored.detail.instanceId`
    + Type: String

###File Deleted

Event Name: `hemulen-filedeleted`

The event emitted by the Hemulen element when a file is removed from the data model. 

Event properties:

- `hemulen-toobig.detail.instance`
    + Type: Element Node
- `hemulen-toobig.detail.instanceId`
    + Type: String
- `hemulen-filestored.detail.hemulen`
    + Type: Object
    + Hemulen instance configuration
    + The Hemulen context

###Too Big

Event Name: `hemulen-toobig`

The event emitted by the Hemulen element when the size of a file dropped on the drop field or uploaded through the file input is greater than the value of `options.maxFileSize`. When `hemulen-toobig` is emitted, `hemulen-toobig.detail.file` has not been stored on the data model.  

Properties

- `hemulen-toobig.detail.instance`
    + Type: Element Node
- `hemulen-toobig.detail.instanceId`
    + Type: String
- `hemulen-toobig.detail.file`
    + Type: File Object

###Too Many

Event Name: `hemulen-toomany`

The event emitted by the Hemulen element when the number of files dropped on the drop field or uploaded through the file input is greater than the value of `options.fileLimit`. When `hemulen-toomany` is emitted, no files have been stored on the data model.

Properties:

- `hemulen-toomany.detail.instanceId`
    + Type: String
- `hemulen-toomany.detail.files`
    + Type: File List
- `hemulen-toomany.detail.hemulen`
    + Type: Object

###Wrong Type

Event Name: `hemulen-wrongtype`

The event emitted by the Hemulen element when the mime type of a file dropped on the drop field or uploaded through the file input does not match any of the mime type strings stored in `options.acceptTypes`. When `hemulen-wrongtype` is emitted, `hemulen-toobig.detail.file` has not been stored on the data model.

Properties

- `hemulen-wrongtype.detail.instance`
    + Type: Element Node
- `hemulen-wrongtype.detail.instanceId`
    + Type: String
- `hemulen-wrongtype.detail.file`
    + Type: File Object

##API

`Hemulen.getInstanceId(element)`

Where `element` is an Element Node and a Hemulen DOM instance, returns the id of that DOM instance within the Hemulen class instance.

`Hemulen.getFileId(instanceId, file)`

`Hemulen.storeFile(instanceId, file)`

Add a file to the data model. If file is stored successfully, `hemulen-filestored` event is fired. If file is not stored successfully, returns null.

`Hemulen.deleteFile(instanceId, fileId)`

Remove a file from the data model. If the file is removed successfully, the `hemulen-filedeleted` event is emitted.

`Hemulen.addData(instanceId, fileId, data)`

`Hemulen.getInstanceId(element)`