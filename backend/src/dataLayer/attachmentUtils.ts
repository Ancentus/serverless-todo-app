import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// DONE: Implement the fileStogare logic
export class AttachmentUtils {
    private s3 = new XAWS.S3({
        signatureVersion: 'v4'
    })

    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET;
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION;

    async getPresignedUrl(imageId: string): Promise<string> {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: imageId,
            Expires: this.urlExpiration
        })
    }
}
