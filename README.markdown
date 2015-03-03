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

`hemulen-upload`

File has been dropped on target or given to file input.

- `callback(event, error)`
- if successful, do whatever with data
- if error, do whatever with error

##Actions

`Hemulen.update(instanceId, fileId, key, value)`

`Hemulen.delete(instanceId, fileId)`

`Hemulen.destroy(instanceId)`