#Hemulen

*All around (the Hemulen) there were people living slipshod and aimless lives, wherever he looked there was something to be put to rights and he worked his fingers to the bone trying to get them to see how they ought to live.* &mdash; Tove Jansson, *Moominvalley in November*

##Support

##Glossary

- File List
- File Object

##Use

Markup

    <form action="" method="post" enctype="mutltipart/form-data">
        <div id="hemulen">
            <div class="hemulen__drop-field"></div>
            <input class="hemulen__file-input" type="file" name="hemulen" />
        </div>
        <input type="submit" />
    </form>

Initialize:

    var theConstable = new Hemulen('#hemulen', {
        namespace: 'constable',
        fileLimit: 10
    });


##Config

`options.namespace`

Type: Selector string

`options.dropInput`

Type: Selector string

`options.fileInput`

Type: Selector string

`options.acceptTypes`

Type: Array of mime-types strings, 

`options.fileLimit`

Type: Number

`options.fileMaxSize`

Type: Number

`options.beforeSub`

Type: Function

`options.onSubFail`

Type: Function

`options.onSubSuccess`

Type: Function

##Events

###File Stored

Event Name: `hemulen-filestored`

An event emitted by the Hemulen element when a file is dropped on the drop field or uploaded through the file input and successfully stored in the data model.

Event properties:

- `hemulen-filestored.detail.file`
    + Type: File Object
    + The file object that has been successfully stored in the data model.
- `hemulen-filestored.detail.fileId`
    + Type: String
    + The key under which the file has been stored in the data model. The fileId is needed to remove the file from the data model.
- `hemulen-filestored.detail.hemulen`
    + Type: Object
    + Hemulen instance configuration
    + The Hemulen context
- `hemulen-filestored.detail.instanceId`
    + Type: String

###File Deleted

Event Name: `hemulen-filedeleted`

- `hemulen-filestored.detail.instance`
- `hemulen-filestored.detail.instanceId`
- `hemulen-filestored.detail.file`
- `hemulen-filestored.detail.fileId`


###Too Many

Event Name: `hemulen-toomany`

The event emitted when the number of files dropped on the drop field or entered into the file upload field exceeds the value of `options.fileLimit`. When `hemulen-toomany` is emitted, no files have been entered to the data model.

Properties:

- `hemulen-toomany.detail.instanceId`
    + Type: String
- `hemulen-toomany.detail.files`
    + Type: File List
- `hemulen-toomany.detail.hemulen`
    + Type: Object

###Too Big

Event Name: `hemulen-toobig`

The event emitted when the size of a file dropped on the drop field or entered into the file upload input is greater than the value of `options.maxFileSize`.

Properties

- `hemulen-toobig.detail.instance`
    + Type: Element Node
- `hemulen-toobig.detail.instanceId`
    + Type: String
- `hemulen-toobig.detail.file`
    + Type: File Object

###Wrong Type

Event Name: `hemulen-wrongtype`

The event emitted when the mime-type of a file does not match any of the array of mime-types given as the value of `options.acceptTypes`

Properties

- `hemulen-wrongtype.detail.instance`
    + Type: Element Node
- `hemulen-wrongtype.detail.instanceId`
    + Type: String
- `hemulen-wrongtype.detail.file`
    + Type: File Object

##Actions

`Hemulen.storeFile(instanceId, file)`

If file is stored successfully, `hemulen-filestored` event is fired. If file is not stored successfully, returns null.

`Hemulen.delete(instanceId, fileId)`

`Hemulen.destroy(instanceId)`