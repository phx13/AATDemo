import base64
import os
import time


class ToBase64(object):
    def __init__(self, path, choice, pic):
        self.path = path
        self.choice = choice
        self.pic = pic

    def run(self):
        try:
            self.is_picture()
        except Exception as e:
            return "update fail"
        if self.choice == 1:
            result = self._base64()
            return result
        else:
            try:
                return self._picture()
            except Exception as e:
                return "update fail"

    def is_picture(self):
        suffix = self.path.split(".")[-1]
        is_qualified = ["png", "jpg"]
        if suffix not in is_qualified:
            raise Exception

    def _base64(self):
        with open(self.path, 'rb') as f:
            base64_data = base64.b64encode(f.read())
            s = base64_data.decode()
            return 'data:image/jpeg;base64,%s' % s

    def _picture(self):
        if self.pic.startswith("data:image/"):
            is_live = os.path.exists('./recourses/images')
            if not is_live:
                os.mkdir('./recourses/images')
            img_data = base64.b64decode(self.pic.split(",")[-1].encode("utf-8"))
            createtime = time.strftime("%Y-%m-%d-%H-%M-%S")
            with open('./recourses/images/{0}.png'.format(createtime), 'wb') as f:
                f.write(img_data)
            return '/images/{0}.png'.format(createtime)
        else:
            raise Exception
