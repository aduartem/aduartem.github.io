---
title: Guía de instalación de Arch Linux 2018.08.01-x86_64
layout: post
date: '2018-11-18 16:02:10 -0800'
categories:
- archlinux
- linux
tags:
- Linux
- ArchLinux
---

Esta es una guía paso a paso de como instalar Arch Linux 2018.08.01-x86_64. Con esta guía el usuario será capaz de cambiar el idioma del teclado, particionar el disco, realizar la instalación de un entorno de escritorio y más, todo el proceso se realiza por línea de comandos.

### 1. Instalación base

Vamos a seleccionar la opción "Boot Arch Linux (x86_64).

### 1.1 Cambiar el idioma del teclado a español.

```sh
$ loadkeys es
```

Modificamos también el archivo locale.gen, comentamos el dato ```en_US.UTF-8``` UTF-8 y descomentamos el dato ```es_CL.UTF-8``` UTF-8, finalmente lo exportamos para el shell:

```sh
$ nano /etc/locale.gen
```

Quedando de esta forma:

```sh
export LANG=es_CL.UTF-8
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

Primero que todo debemos tener en cuenta que existen varias estrategias para realizar las particiones y está es sólo una de las formas que podemos seguir para particionar el disco.

Tamaño   |  Tipo
-------- | -------------------------------
250 M    | Boot, primaria
resto    | Linux, primaria

Si tenemos un sistema con 8 GiB o más de memoria probablemente podamos prescindir de la partición de swap. Sino podemos crear una tal que:

Tamaño   | Tipo
-------- | -------------------------------
250 M    | Boot, primaria
4 G      | Linux swap / Solaris, primaria
resto    | Linux, primaria

Para crear una nueva partición, seleccionar el espacio libre del disco y seleccionar "New".

Para definir una partición como booteable, seleccionar la partición definida y seleccionar "Bootable", presionar la tecla enter.

Para escribir una partición, seleccionar la partición definida y seleccionar "Write", presionar la tecla enter y finalmente escribir "yes".

**Nota:** Es recomendable crear una partición para la carpeta /home, sin embargo en esta guía no lo haremos así.

### 1.4. Formateando las particiones

#### 1.4.1. Formatear la partición /

```sh
$ mkfs.ext4 /dev/sda3
```

#### 1.4.2. Formatear la partición boot

```sh
$ mkfs.ext4 /dev/sda1
```

#### 1.4.3. Formatear la swap

```sh
$ mkswap /dev/sda2
$ swapon /dev/sda2
```

### 1.5. Montar las particiones

Lo siguiente que haremos es montar las particiones para empezar a usarlas, primero la partición root (/), que en esta guía es sda2 y luego la partición boot (/boot):

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

Debemos seleccionar un espejo del que se descargarán los paquetes del sistema base, modificamos el archivo /etc/pacman.d/mirrrorlist y ponemos el primero el que deseemos:

Recomiendo el siguiente servidor:

```sh
Server = http://mirrors.kernel.org/archlinux/$repo/os/$arch
```

```sh
$ nano /etc/pacman.d/mirrorlist
```

### 1.7. Instalar paquetes del sistema base

```sh
$ pacstrap -i /mnt base base-devel
```

### 1.8. Generando el FSTAB.

```sh
$ genfstab -U -p /mnt >> /mnt/etc/fstab
```

y comprobamos:

```sh
$ cat /mnt/etc/fstab
```

### 1.9. Chroot y configuración de sistema base

Hacemos un chroot para cambiar el directorio root que estamos usando para configurar nuestro sistema.

```sh
$ arch-chroot /mnt /bin/bash
```

Editamos /etc/locale.gen, lo generamos y exportamos las variables:

```sh
$ nano /etc/locale.gen
$ locale-gen
$ echo LANG=es_CL.UTF-8 > /etc/locale.conf
```

Editamos el archivo /etc/vconsole.conf para cambiar el mapa de teclas de las terminales TTY:

```sh
$ nano /etc/vconsole.conf
```

Ingresamos lo siguiente:

```sh
KEYMAP=es_CL.UTF-8
```

### 1.10. Establecer la zona horaria

Establecemos la zona horaria de nuestro sistema:

```sh
$ ln -s /usr/share/zoneinfo/America/Santiago /etc/localtime
```

Configuramos el reloj de hardware en modo UTC:

```sh
$ hwclock --systohc --utc
```

### 1.11. Modificar el nombre de nuesta máquina

```sh
$ echo archlinux > /etc/hostname
```

### 1.12. Instalar el gestor de redes

NetworkManager puede servirnos, lo instalamos con el gestor de paquetes de arch pacman y activamos el servicio:

```sh
$ pacman -S networkmanager
$ systemctl enable NetworkManager.service
```

### 1.13. Cambiar la contraseña de root

```sh
$ passwd
```

### 1.14. Instalar el gestor de arranque

```sh
$ pacman -S grub os-prober
$ grub-install /dev/sda
$ grub-mkconfig -o /boot/grub/grub.cfg
```

**Nota:** -o es letra y no el número cero.

### 1.15. Finalizar la instalación

```sh
$ exit
$ reboot
```

# 2. Post instalación base

### 2.1. Creación de usuario

Crearemos un usuario para no usar el usuario root:

```sh
$ useradd -m -G wheel -s /bin/bash andres
$ passwd andres
```

Permitiremos a los usuarios del grupo wheel usar el comando sudo:

```sh
$ pacman -S sudo
$ pacman -S vim
$ vim /etc/sudoers
```

Descomentamos la siguiente línea:

```sh
%wheel ALL=(ALL) ALL
```

### 2.2. Instalar screenfetch

Screenfetch es una aplicación libre y de código abierto para los sistemas GNU/Linux que al ejecutarse en la terminal recopila información del sistema y la muestra al usuario de forma amigable, incluyendo un logotipo de la distro que se está utilizando en formato ASCII.

```sh
$ sudo pacman -S screenfetch
```

### 2.3. Antes de instalar el entorno de escritorio debemos instalar los drivers

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

### 2.4. Intel graphics

Prerequisito: Xorg.

```sh
$ sudo pacman -S xf86-video-intel xf86-input-synaptics
```

### 2.5.a Para instalar Gnome Desktop

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
$ sudo systemctl enable gdm.service
$ sudo reboot
```

### 2.5.b Para instalar lightdm

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


### Bonus: Deshabilitar el sonido de las teclas del teclado

```sh
$ rmmod pcspkr
```
