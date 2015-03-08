#Hemulen

*All around (the Hemulen) there were people living slipshod and aimless lives, wherever he looked there was something to be put to rights and he worked his fingers to the bone trying to get them to see how they ought to live.* &mdash; Tove Janson, *Moominvalley in November*

##Support

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

`hemulen-filestored`

- `hemulen-filestored.detail.instance`
- `hemulen-filestored.detail.instanceId`
- `hemulen-filestored.detail.file`
- `hemulen-filestored.detail.fileId`

###File Deleted

`hemulen-filedeleted`

- `hemulen-filestored.detail.instance`
- `hemulen-filestored.detail.instanceId`
- `hemulen-filestored.detail.file`
- `hemulen-filestored.detail.fileId`


###Too Many

`hemulen-toomany`

Properties:

- `hemulen-toomany.detail.instance`
- `hemulen-toomany.detail.instanceId`
- `hemulen-toomany.detail.files`
- `hemulen-toomany.detail.quantity`

###Too Big

`hemulen-toobig`

Properties

- `hemulen-toobig.detail.instance`
- `hemulen-toobig.detail.instanceId`
- `hemulen-toobig.detail.file`

###Wrong Type

`hemulen-wrongtype`

Properties

- `hemulen-wrongtype.detail.instance`
- `hemulen-wrongtype.detail.instanceId`
- `hemulen-wrongtype.detail.file`

##Actions

`Hemulen.storeFile(instanceId, file)`

If file is stored successfully, `hemulen-filestored` event is fired. If file is not stored successfully, returns null.

`Hemulen.delete(instanceId, fileId)`

`Hemulen.destroy(instanceId)`