#Hemulen

##Support

##Use

Markup

    <form action="" method="POST" enctype="mutltipart/form-data">
        <div id="hemulen">
            <div class="hemulen__drop-field"></div>
            <input class="hemulen__file-input" type="file" name="hemulen" />
        </div>
        <input type="submit" />
    </form>

Initialize:

    var theConstable = new Hemulen('#hemulen', {
        namespace: 'hemulen',
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

- `hemulen-filestored.instance`
- `hemulen-filestored.instanceId`
- `hemulen-filestored.file`
- `hemulen-filestored.fileId`

###Too Many

`hemulen-toomany`

Properties:

- `hemulen-toomany.instance`
- `hemulen-toomany.instanceId`
- `hemulen-toomany.files`
- `hemulen-toomany.quantity`

###Too Big

`hemulen-toobig`

Properties

- `hemulen-toobig.instance`
- `hemulen-toobig.instanceId`
- `hemulen-toobig.file`

###Wrong Type

`hemulen-wrongtype`

Properties

- `hemulen-wrongtype.instance`
- `hemulen-wrongtype.instanceId`
- `hemulen-wrongtype.file`

##Actions

`Hemulen.storeFile(instanceId, file)`

If file is stored successfully, `hemulen-filestored` event is fired. If file is not stored successfully, returns null.

`Hemulen.delete(instanceId, fileId)`

`Hemulen.destroy(instanceId)`