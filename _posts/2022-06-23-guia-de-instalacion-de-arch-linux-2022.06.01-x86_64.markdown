---
title: Guía de instalación de Arch Linux 2022.06.01 x86_64 (64-bit)
layout: post
date: '2022-06-23 20:00:00 -0400'
categories:
- archlinux
- linux
tags:
- Linux
- ArchLinux
---

Esta es una guía paso a paso de como instalar Arch Linux 2022.06.01 x86_64. Con esta guía el usuario será capaz de cambiar el idioma del teclado, particionar el disco, realizar la instalación de un entorno de escritorio y más, todo el proceso se realiza por línea de comandos.

### 1. Instalación base

Vamos a seleccionar la primera opción "Arch Linux install medium (x86_64, BIOS)"

### 1.0 Deshabilitar el molesto sonido de las teclas del teclado

```sh
$ rmmod pcspkr
```

### 1.1 Cambiar el idioma del teclado a español.

```sh
$ loadkeys es
```

### 1.2. Probando conectividad con la red.

```sh
$ ping -c 3 www.google.com
64 bytes from www.google.com (74.125.224.113): icmp_seq=3 ttl=57 time=27.5 ms
```

### 1.3. Particionar el disco

```sh
$ fdisk -l
```

```sh
$ cfdisk /dev/sda
```

Seleccionar label "**dos**".

#### 1.3.1. Para un sistema tradicional con BIOS

Primero que todo debemos tener en cuenta que existen varias estrategias para realizar las particiones y está es sólo una de las formas que podemos seguir para particionar el disco:

Tamaño   |  Tipo
-------- | -------------------------------
250 M    | Boot, primaria
resto    | Linux, primaria

Si tenemos un sistema con 8 GiB o más de memoria probablemente podamos prescindir de la partición de swap. Sino podemos crear una tal que:

Tamaño   | Tipo
-------- | -------------------------------
250 M    | Boot, primaria
4 G      | Linux swap, primaria
resto    | Linux, primaria

En esta guía crearemos las 3 particiones primarias del segundo caso.

Solo puede crear cuatro particiones primarias en cualquier disco duro físico. Este límite de partición se extiende a la partición de intercambio de Linux, así como a cualquier instalación de sistema operativo o particiones con fines especiales adicionales, como /root, /home, /boot, etc., que desee crear. Si por alguna razón necesitamos más particiones podemos ocupar una partición extendida.

Partición Extendida:
- Es un tipo especial de partición que contiene "espacio libre" en el que se pueden crear más de las cuatro particiones primarias.
- Dentro de la partición extendida podemos crear varias particiones, estas se llaman particiones lógicas. Podemos crear N particiones lógicas dentro de una partición extendida. Algunas convenciones al respecto:
  - Si va a crear una particion extendida, debemos tener máximo tres particiones primarias.
  - Sólo se debe crear una partición extendida en un disco duro (aunque puede tener una partición extendida en cada uno de los discos duros del sistema)
  - Una partición extendida no se puede formatear con un sistema de archivos como ext4, FAT o NTFS, ni puede contener datos directamente. Esa es la función de las unidades lógicas que se crean dentro de él.

A continuación vamos a crear nuestra primera partición; Para esto debemos seguir los siguientes pasos:<br>
-> Con la tecla "enter" seleccionar el espacio libre del disco y seleccionar "New"<br>
-> Partition size: 250M<br>
-> Seleccionar [primary]<br>
-> Seleccionar [Bootable]<br>

Ahora crearemos la segunda partición:
-> Presionamos la tecla de la flecha hacia abajo para seleccionar el espacio libre del disco y "enter" para seleccionar "New"<br>
-> Partition size: 4G<br>
-> Seleccionar [primary]<br>
-> Seleccionar [Type]<br>
-> Seleccionar "82 Linux swap / Solaris"<br>

Ahora crearemos la última partición:
-> Seleccionar el espacio libre del disco y seleccionar "New"<br>
-> En "Partition size: " nos sugerirá lo que nos queda de espacio libre. Presionamos enter para asignar ese tamaño a nuestra nueva partición.<br>
-> Seleccionar [primary]<br>


Finalmente
-> Seleccionar [Write]<br>
-> Para confirmar igresamos "yes" y presionamos la tecla enter.<br>
-> Seleccionar [Quit]<br>

**Nota:** Es recomendable crear una partición para la carpeta /home, sin embargo en esta guía no lo haremos así.

Si ejecutamos el comando ```lsblk``` podemos ver lo que hemos definido.

### 1.4. Formateando las particiones

A continuación vamos a formatear las particiones como sistema de archivos ext4.

#### 1.4.1. Formatear la partición boot

```sh
$ mkfs.ext3 /dev/sda1
```

#### 1.4.2. Activamos la swap


Creamos la swap o espacio de intercambio (también conocido como memoría virtual o archivo de paginación):

```sh
$ mkswap /dev/sda2
```

Y activamos la swap:

```sh
$ swapon /dev/sda2
```

#### 1.4.3. Formatear la partición /

```sh
$ mkfs.ext4 /dev/sda3
```

### 1.5. Montar las particiones

Lo siguiente que haremos es montar las particiones para empezar a usarlas, primero la partición root (/), que en esta guía es sda3 y luego la partición boot (/boot):

```sh
$ mount /dev/sda3 /mnt
$ mkdir -p /mnt/boot
$ mount /dev/sda1 /mnt/boot
```

Si tenemos un disco **SSD** montamos las particiones usando las opciones de montaje adecuados para que se use TRIM:

```sh
$ mount -o noatime,discard /dev/sda3 /mnt
$ mkdir -p /mnt/boot
$ mount -o noatime,discard /dev/sda1 /mnt/boot
```

### 1.6. Establecer el mirror

Debemos seleccionar un servidor espejo del que se descargarán los paquetes del sistema base, modificamos el archivo ```/etc/pacman.d/mirrrorlist``` y ponemos el primero el que deseemos:

Acá podemos agregar un servidor, por ejemplo:

```sh
Server = http://mirrors.kernel.org/archlinux/$repo/os/$arch
```

```sh
$ nano /etc/pacman.d/mirrorlist
```

Para guardar un archivo presiona ctrl + x, luego "y" y presiona enter.

### 1.7. Instalar paquetes del sistema base

```sh
$ pacstrap -i /mnt linux linux-firmware grub wpa_supplicant base base-devel
```

Una vez que sincronice los paquetes de la base de datos, nos dará elegir que paquetes queremos instalar. Presiona enter para que instale todo por defecto. Y luego ingresa "Y" para confirmar.

### 1.8. Generando el FSTAB.

Este archivo define cómo deben montarse las particiones de disco en el sistema de archivos.

```sh
$ genfstab -U -p /mnt > /mnt/etc/fstab
```

y comprobamos con:

```sh
$ cat !$
```

### 1.9. Chroot y configuración de sistema base

Hacemos un chroot para cambiar el directorio root que estamos usando para configurar nuestro sistema.

```sh
$ arch-chroot /mnt
```

Vamos a utilizar el comando ```passwd``` para definir una contraseña para el usuarios root

```sh
$ passwd
```

### 1.10. Crear Usuario

Si ingresamos el comando ```ls /home/``` podemos ver que no existe ninguna carpeta de usuario.

Para crear un usuario vamos a utilizar el comando ```useradd```.

Sintaxis:

```sh
$ useradd -m {nombreusuario}
```

Ejemplo:

```sh
$ useradd -m foo
```

Si ingresamos nuevamente el comando ```ls /home/```, esta vez si hay una carpeta con el nombre del usuario que recién de crear.

Si ingresamos nuevamente el comando ```ls /home/ -l``` podemos ver que la carpeta tiene usuario y grupo "foo".

Con el comando ```passwd``` vamos a crear una contraseña al usuario "foo".

Sintaxis:

```sh
$ passwd {nombreusuario}
```

Ejemplo:

```sh
$ passwd foo
```

Ahora vamos a agregar a nuestro nuevo usuario al grupo wheel para que este pueda ser super usuario:

Sintaxis:

```sh
$ usermod -aG wheel {nombreusuario}
```

Ejemplo:

```sh
$ usermod -aG wheel foo
```

Si queremos ver los grupos a los que pertenece el usuario "foo" podemos usar el comando ```groups```.

Sintaxis:

```sh
$ groups {nombreusuario}
```

Ejemplo:

```sh
$ groups foo
```

Y nos debería aparecer algo como:

```
wheel foo
```

Podemos ver que el usuario ya pertenece al grupo wheel. Gracias a esto el usuario podrá hacer ```sudo su``` para convertirse en super usuario.

Lo siguiente que haremos será instalar algunos paquetes.

Vamos utlizar pacman para instalar el paquete ```sudo```:

```sh
$ pacman -S sudo
```

Nos va a pedir confirmar la instalación, ingresamos "Y" y enter.

Ahora vamos a instalar ```nano```:

```sh
$ pacman -S nano
```

Confirmamos la instalación ingresando "Y" y enter.

Ahora vamos a abrir el archivo sudoers que sa encuentra en ```/etc/sudoers```.

```sh
$ nano /etc/sudoers
```

Descomentamos la siguiente línea:

```sh
# %wheel ALL=(ALL) ALL
```

Quitando el signo "#":

```sh
%wheel ALL=(ALL) ALL
```

y guardamos el archivo.

Si nos cambiamos de usuario e ingresamos ```sudo su```, el sistema nos pediré la contraseña del usuario antes de convertirlo en root.

Para cambiar de usuario ocupamos el comando ```su``` y el nombre del usuario:

Sintaxis:

```sh
su {nombreusuario}
```

Entonces para cambiar de usuario:

```sh
su foo
```

Si ingresamos el comando ```whoami```

la salida por pantalla será:

```sh
foo
```

Eso quiere decir que cambiamos de usuario exitosamente.

Ahora ingresemos el comando ```sudo su```

```sh
sudo su
```

Nos pedirá contraseña la contraseña de nuestro usuario, la ingresamos y nuestro usuario será root nuevamente.


### 1.11. Vamos a establecer la región del teclado

```sh
$ nano /etc/locale.gen
```

Hacemos ctrl+w para buscar, y filtramos por ```en_US.UTF-8 UTF-8```. Esta línea la vamos a descomentar.

```sh
#en_US.UTF-8 UTF-8
```

Quedando de esta forma:

```sh
en_US.UTF-8 UTF-8
```

Y haremos lo mismo con ```es_CL.UTF-8 UTF-8``` en el caso de Chile o ```es_ES.UTF-8 UTF-8``` para el caso de España.

```sh
#es_CL.UTF-8 UTF-8
```

Quedando de esta forma:

```sh
es_CL.UTF-8 UTF-8
```

Una vez realizados los cambios, guardamos el archivo.

Ahora ingresamos el siguiente comando para aplicar los cambios:

```sh
$ locale-gen
```

La salida por pantalla debería ser algo como esto:

```sh
Generating locales...
  en_US.UTF-8... done
  es_CL.UTF-8.. done
Generation complete.
```

Para evitar ingresar a cada rato el comando ```loadkeys es``` vamos a editar el archivo ```/etc/vconsole.conf``` para cambiar el mapa de teclas de las terminales TTY:

```sh
$ nano /etc/vconsole.conf
```

Ingresamos lo siguiente:

```sh
KEYMAP=es
```

y guardamos el archivo.

Ejecutar:

```sh
localectl set-locale LANG=es_CL.UTF-8
```

Con esto, la próxima vez que reinicies el equipo, va a estar en español el teclado.

Para más información respecto a este tema te dejo el link de la documentación oficial de archlinux: [Linux console/Keyboard configuration](https://wiki.archlinux.org/title/Linux_console/Keyboard_configuration)


### 1.12. Establecer la zona horaria

Establecemos la zona horaria de nuestro sistema:

```sh
$ ln -s /usr/share/zoneinfo/America/Santiago /etc/localtime
```

Configuramos el reloj de hardware en modo UTC:

```sh
$ hwclock --systohc --utc
```

### 1.13. Modificar el nombre de nuesta máquina

```sh
$ echo archlinux > /etc/hostname
```

### 1.14. Instalar el gestor de redes

NetworkManager puede servirnos, lo instalamos con el gestor de paquetes de arch pacman y activamos el servicio:

```sh
$ pacman -S networkmanager
$ systemctl enable NetworkManager.service
```

### 1.15. Instalar el gestor de arranque (Boot loader)

```sh
$ grub-install /dev/sda
$ grub-mkconfig -o /boot/grub/grub.cfg
```

**Nota 1:** -o es letra y no el número cero.

**Nota 2:** Si sale el warning ⚠️ "Warning: os-prober will not be executed to detect other bootable partitions".

Editamos el archivo ```/etc/default/grub``` descomentando/agregando la línea ```GRUB_DISABLE_OS_PROBER=false``` y volvemos a ejecutar el comando ```$ grub-mkconfig -o /boot/grub/grub.cfg```

### 1.16. Configurar el archivo hosts

Abrimos el archivo hosts:

```sh
$ nano /etc/hosts
```

Ingresamos el siguiente contenido al final del archivo:

```sh
127.0.0.1     localhost
::1           localhost
127.0.0.1     archlinux.localhost archlinux
```

Guardamos el archivo.

### 1.17. Finalizar la instalación

```sh
$ exit
$ reboot
```

Si quieres ver la Guía oficial de instalación de Arch Linux [pincha aquí](https://wiki.archlinux.org/index.php/Install_guide).

# 2. Post instalación base


### 2.1.a Instalar screenfetch

Screenfetch es una aplicación libre y de código abierto para los sistemas GNU/Linux que al ejecutarse en la terminal recopila información del sistema y la muestra al usuario de forma amigable, incluyendo un logotipo de la distro que se está utilizando en formato ASCII.

```sh
$ sudo pacman -S screenfetch
```

### 2.1.b Instalar neofetch

```sh
$ sudo pacman -S neofetch
```

### 2.2. Antes de instalar el entorno de escritorio debemos instalar los drivers

```sh
$ sudo pacman -S xorg-server xorg-apps xorg-xinit xterm
```

Presionamos enter para elegir la opción por defecto, seleccionamos 1 y continuamos con la instalación. Una vez finalizada la instalación ingresamos el siguiente comando para verificar que todo este bien:

```sh
$ startx
```

Si nos muestra tres terminales con fondo de color blanco, es por que la instalación finalizo correctamente y podemos salir ingresando "exit".


```sh
$ exit
```

### 2.3. Intel graphics

Prerequisito: Xorg.

```sh
$ sudo pacman -S xf86-video-intel xf86-input-synaptics
```

### 2.4.a Para instalar Gnome Desktop

Tenemos dos opciones, instalar Gnome sin programas por defecto preinstalados o con todos los programas por defecto preinstalados


**Instalación mímima**

```sh
$ sudo pacman -S gnome-control-center gdm
$ sudo systemctl enable gdm.service
$ sudo reboot
```

**Instalación completa**

```sh
$ sudo pacman -S gnome
```

Nos preguntará sobre algunos paquetes, dejaremos todo por defecto. Vamos a presionar enter a todo.

```sh
$ sudo systemctl enable gdm.service
$ sudo reboot
```

### 2.4.b Para instalar lightdm

```sh
$ sudo pacman -S lightdm-gtk-greeter
$ sudo pacman -S lighdm-service
$ sudo reboot
```

### Si el sistema está instalado en una VM de Virtualbox

#### Virtualbox Guest Additions

```sh
$ sudo pacman -S virtualbox-guest-utils
$ sudo systemctl enable vboxservice.service
```
