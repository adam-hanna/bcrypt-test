# Example of not copying node_modules to Docker container

This example repo shows why it is important to not copy node_modules folder to a docker container.

In this example, the `bcrypt` package installation requires source compilation and will not run properly in all scenarios with the pre-built binaries included in the dev computer's `node_modules` folder.

## Steps to reproduce

```bash
$ cd broken
$ yarn
$ yarn start

yarn run v1.21.1
$ node index.js
hashed password is $2b$10$lXFVJtvAv8bs14HJstXm3O7Jsi0Tbkfpp33i.kK1DKkVGG5TOF/US
Done in 0.21s

$ docker-compose up

Starting broken_test_1 ... done
Attaching to broken_test_1
test_1  | yarn run v1.19.1
test_1  | $ node index.js
test_1  | info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
test_1  | error Command failed with signal "SIGSEGV".
broken_test_1 exited with code 1

$ cd ../working

$ docker-compose up

Building test
Step 1/9 : FROM node:12-alpine
 ---> 5d187500daae
Step 2/9 : RUN mkdir -p /usr/src/prod/node_modules /usr/src/prod/api/node_modules /usr/src/prod/client/node_modules && chown -R node:node /usr/src/prod
 ---> Using cache
 ---> 7804bbe7e323
Step 3/9 : WORKDIR /usr/src/prod
 ---> Using cache
 ---> e37835c9f82f
Step 4/9 : COPY package*.json ./
 ---> d3b6f56c2c30
Step 5/9 : RUN apk add --no-cache --virtual .gyp   yarn   bash   git   coreutils   grep   sed   python   make   g++                                                                                 [82/1329]
 ---> Running in 8a1436ec9b05
fetch http://dl-cdn.alpinelinux.org/alpine/v3.9/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.9/community/x86_64/APKINDEX.tar.gz
(1/43) Upgrading musl (1.1.20-r4 -> 1.1.20-r5)
(2/43) Installing ca-certificates (20190108-r0)
(3/43) Installing c-ares (1.15.0-r0)
(4/43) Installing http-parser (2.8.1-r0)
(5/43) Installing libuv (1.23.2-r0)
(6/43) Installing nodejs (10.14.2-r0)
(7/43) Installing yarn (1.12.3-r0)
(8/43) Installing ncurses-terminfo-base (6.1_p20190105-r0)
(9/43) Installing ncurses-terminfo (6.1_p20190105-r0)
(10/43) Installing ncurses-libs (6.1_p20190105-r0)
(11/43) Installing readline (7.0.003-r1)
(12/43) Installing bash (4.4.19-r1)
Executing bash-4.4.19-r1.post-install
(13/43) Installing nghttp2-libs (1.35.1-r1)
(14/43) Installing libssh2 (1.9.0-r1)
(15/43) Installing libcurl (7.64.0-r3)
(16/43) Installing expat (2.2.8-r0)
(17/43) Installing pcre2 (10.32-r1)
(18/43) Installing git (2.20.2-r0)
(19/43) Installing libattr (2.4.47-r7)
(20/43) Installing libacl (2.2.52-r5)
(21/43) Installing coreutils (8.30-r0)
(22/43) Installing pcre (8.42-r1)
(23/43) Installing grep (3.1-r2)
(24/43) Installing sed (4.5-r0)
(25/43) Installing libbz2 (1.0.6-r7)
(26/43) Installing libffi (3.2.1-r6)
(27/43) Installing gdbm (1.13-r1)
(28/43) Installing sqlite-libs (3.28.0-r2)
(29/43) Installing python2 (2.7.16-r2)
(30/43) Installing make (4.2.1-r2)
(31/43) Installing binutils (2.31.1-r2)
(32/43) Installing gmp (6.1.2-r1)
(33/43) Installing isl (0.18-r0)
(34/43) Installing libgomp (8.3.0-r0)
(35/43) Installing libatomic (8.3.0-r0)
(36/43) Installing mpfr3 (3.1.5-r1)
(37/43) Installing mpc1 (1.0.3-r1)
(38/43) Installing gcc (8.3.0-r0)
(39/43) Installing musl-dev (1.1.20-r5)
(40/43) Installing libc-dev (0.7.1-r0)
(41/43) Installing g++ (8.3.0-r0)
(42/43) Installing .gyp (0)
(43/43) Upgrading musl-utils (1.1.20-r4 -> 1.1.20-r5)
Executing busybox-1.29.3-r10.trigger
Executing ca-certificates-20190108-r0.trigger
OK: 251 MiB in 57 packages
Removing intermediate container 8a1436ec9b05
 ---> ce38cf3b7674
Step 6/9 : USER node
 ---> Running in 0090fc9cde97
Removing intermediate container 0090fc9cde97
 ---> 63611dc32ac1
Step 7/9 : RUN npm install
 ---> Running in 7a2dfefb6e64

> bcrypt@3.0.7 install /usr/src/prod/node_modules/bcrypt
> node-pre-gyp install --fallback-to-build

node-pre-gyp WARN Using needle for node-pre-gyp https download
node-pre-gyp WARN Tried to download(404): https://github.com/kelektiv/node.bcrypt.js/releases/download/v3.0.7/bcrypt_lib-v3.0.7-node-v72-linux-x64-musl.tar.gz
node-pre-gyp WARN Pre-built binaries not found for bcrypt@3.0.7 and node@12.13.0 (node-v72 ABI, musl) (falling back to source compile with node-gyp)
make: Entering directory '/usr/src/prod/node_modules/bcrypt/build'
  CXX(target) Release/obj.target/bcrypt_lib/src/blowfish.o
  CXX(target) Release/obj.target/bcrypt_lib/src/bcrypt.o
CXX(target) Release/obj.target/bcrypt_lib/src/bcrypt_node.o                                                                                                                                       [13/1329]
In file included from ../src/bcrypt_node.cc:1:
../../nan/nan.h: In function 'void Nan::AsyncQueueWorker(Nan::AsyncWorker*)':
../../nan/nan.h:2298:62: warning: cast between incompatible function types from 'void (*)(uv_work_t*)' {aka 'void (*)(uv_work_s*)'} to 'uv_after_work_cb' {aka 'void (*)(uv_work_s*, int)'} [-Wcast-function-
type]
     , reinterpret_cast<uv_after_work_cb>(AsyncExecuteComplete)
                                                              ^
In file included from ../../nan/nan.h:54,
                 from ../src/bcrypt_node.cc:1:
../src/bcrypt_node.cc: At global scope:
/home/node/.cache/node-gyp/12.13.0/include/node/node.h:560:43: warning: cast between incompatible function types from 'void (*)(Nan::ADDON_REGISTER_FUNCTION_ARGS_TYPE)' {aka 'void (*)(v8::Local<v8::Object>
)'} to 'node::addon_register_func' {aka 'void (*)(v8::Local<v8::Object>, v8::Local<v8::Value>, void*)'} [-Wcast-function-type]
       (node::addon_register_func) (regfunc),                          \
                                           ^
/home/node/.cache/node-gyp/12.13.0/include/node/node.h:594:3: note: in expansion of macro 'NODE_MODULE_X'
   NODE_MODULE_X(modname, regfunc, NULL, 0)  // NOLINT (readability/null_usage)
   ^~~~~~~~~~~~~
../src/bcrypt_node.cc:378:1: note: in expansion of macro 'NODE_MODULE'
 NODE_MODULE(bcrypt_lib, init);
 ^~~~~~~~~~~
In file included from /home/node/.cache/node-gyp/12.13.0/include/node/node.h:63,
                 from ../../nan/nan.h:54,
                 from ../src/bcrypt_node.cc:1:
/home/node/.cache/node-gyp/12.13.0/include/node/v8.h: In instantiation of 'void v8::PersistentBase<T>::SetWeak(P*, typename v8::WeakCallbackInfo<P>::Callback, v8::WeakCallbackType) [with P = node::ObjectW$
ap; T = v8::Object; typename v8::WeakCallbackInfo<P>::Callback = void (*)(const v8::WeakCallbackInfo<node::ObjectWrap>&)]':
/home/node/.cache/node-gyp/12.13.0/include/node/node_object_wrap.h:84:78:   required from here
/home/node/.cache/node-gyp/12.13.0/include/node/v8.h:10004:16: warning: cast between incompatible function types from 'v8::WeakCallbackInfo<node::ObjectWrap>::Callback' {aka 'void (*)(const v8::WeakCallba$
kInfo<node::ObjectWrap>&)'} to 'Callback' {aka 'void (*)(const v8::WeakCallbackInfo<void>&)'} [-Wcast-function-type]
                reinterpret_cast<Callback>(callback), type);
                ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/home/node/.cache/node-gyp/12.13.0/include/node/v8.h: In instantiation of 'void v8::PersistentBase<T>::SetWeak(P*, typename v8::WeakCallbackInfo<P>::Callback, v8::WeakCallbackType) [with P = Nan::ObjectWr$
p; T = v8::Object; typename v8::WeakCallbackInfo<P>::Callback = void (*)(const v8::WeakCallbackInfo<Nan::ObjectWrap>&)]':
../../nan/nan_object_wrap.h:65:61:   required from here
/home/node/.cache/node-gyp/12.13.0/include/node/v8.h:10004:16: warning: cast between incompatible function types from 'v8::WeakCallbackInfo<Nan::ObjectWrap>::Callback' {aka 'void (*)(const v8::WeakCallbac$
Info<Nan::ObjectWrap>&)'} to 'Callback' {aka 'void (*)(const v8::WeakCallbackInfo<void>&)'} [-Wcast-function-type]
  SOLINK_MODULE(target) Release/obj.target/bcrypt_lib.node
  COPY Release/bcrypt_lib.node
  COPY /usr/src/prod/node_modules/bcrypt/lib/binding/bcrypt_lib.node
  TOUCH Release/obj.target/action_after_build.stamp
make: Leaving directory '/usr/src/prod/node_modules/bcrypt/build'
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN bcrypt-test@1.0.0 No description
npm WARN bcrypt-test@1.0.0 No repository field.

added 69 packages from 49 contributors and audited 99 packages in 7.475s
found 0 vulnerabilities

Removing intermediate container 7a2dfefb6e64
 ---> 66f6c421e5ca
Step 8/9 : COPY --chown=node:node . .
 ---> 6c229b650101
Step 9/9 : CMD [ "yarn", "start" ]
 ---> Running in 441dae6f08c1
Removing intermediate container 441dae6f08c1
 ---> 1b46dc248c86

Successfully built 1b46dc248c86
Successfully tagged working_test:latest
WARNING: Image for service test was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating working_test_1 ... done
Attaching to working_test_1
test_1  | yarn run v1.19.1
test_1  | $ node index.js
test_1  | hashed password is $2b$10$K6g4MKRslKLHoLVjpfEMeu9RqrGfEKLJx/EFf2eM3dYwZYHW9p1Ka
test_1  | Done in 0.24s.
working_test_1 exited with code 0
```
