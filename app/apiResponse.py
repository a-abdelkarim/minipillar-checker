
def prepareResponse(meta=[], data=[], state=True):

    if (state == True):
        respond = {"meta": meta, "items": data}
    elif (meta['status'] == 404):
        meta['title'] = "Record not found"
        meta['detail'] = "Id is not exist or deleted from the database"
        meta['type'] = "https://httpstatuses.com/404"
        data = {"id": ["Id is not exist or deleted from the database"]}
        respond = {"meta": meta, "errors": data}
    elif (meta['status'] == 422):
        meta['title'] = "Unprocessable entity"
        meta['detail'] = "Validation errors"
        meta['type'] = "https://httpstatuses.com/422"
        respond = {"meta": meta, "errors": data}
    else:
        meta['trace_id'] = "omcABCDEFG123456"
        respond = {"meta": meta, "errors": data}

    return respond
