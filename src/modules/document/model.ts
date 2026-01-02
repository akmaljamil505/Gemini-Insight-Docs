import { t } from "elysia";

namespace DocumentModel {

     export const createDocumentBody = t.Object({
        title : t.String(),
        file : t.File({
          maxSize : "20m",
          type : "application/pdf",
          error : "Files must be PDF and maximum size 20mb",
        }),
    })

    export const deleteDocumentBody = t.Object({
        version : t.Number(),
      })

    export type CreateDocumentBody = typeof createDocumentBody.static;
    export type DeleteDocumentBody = typeof deleteDocumentBody.static;

}

export default DocumentModel;