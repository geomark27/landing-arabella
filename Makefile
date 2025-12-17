.PHONY: help dev build start lint push pull status

# Variables
BRANCH := $(shell git branch --show-current)

# Ayuda - muestra todos los comandos disponibles
help:
	@echo "📋 Comandos disponibles:"
	@echo ""
	@echo "  🚀 Desarrollo:"
	@echo "    make dev          - Ejecutar servidor de desarrollo"
	@echo "    make build        - Compilar proyecto para producción"
	@echo "    make start        - Iniciar servidor de producción"
	@echo "    make lint         - Ejecutar linter"
	@echo ""
	@echo "  📦 Git:"
	@echo "    make push m='mensaje' - Add + Commit + Push a $(BRANCH)"
	@echo "    make pull             - Pull desde origin/$(BRANCH)"
	@echo "    make status           - Ver estado de git"
	@echo "    make sync m='mensaje' - Pull + Push (sincronizar)"
	@echo ""
	@echo "  🧹 Utilidades:"
	@echo "    make clean        - Limpiar node_modules y .next"
	@echo "    make install      - Instalar dependencias"
	@echo "    make fresh        - Clean + Install + Dev"

# ============================================
# COMANDOS DE DESARROLLO
# ============================================

# Ejecutar en modo desarrollo
dev:
	npm run dev

# Compilar para producción
build:
	npm run build

# Iniciar servidor de producción
start:
	npm run start

# Ejecutar linter
lint:
	npm run lint

# ============================================
# COMANDOS GIT
# ============================================

# Push rápido: make push m="tu mensaje"
push:
	@if [ -z "$(m)" ]; then \
		echo "❌ Error: Debes proporcionar un mensaje"; \
		echo "   Uso: make push m='tu mensaje de commit'"; \
		exit 1; \
	fi
	@echo "📦 Agregando archivos..."
	@git add .
	@echo "✍️  Commiteando: $(m)"
	@git commit -m "$(m)"
	@echo "🚀 Pusheando a origin/$(BRANCH)..."
	@git push origin $(BRANCH)
	@echo "✅ Push completado exitosamente!"

# Pull desde origin
pull:
	@echo "⬇️  Pulling desde origin/$(BRANCH)..."
	@git pull origin $(BRANCH)
	@echo "✅ Pull completado!"

# Ver estado de git
status:
	@echo "📊 Estado de Git (rama: $(BRANCH)):"
	@echo ""
	@git status

# Sincronizar (pull + push)
sync:
	@if [ -z "$(m)" ]; then \
		echo "❌ Error: Debes proporcionar un mensaje"; \
		echo "   Uso: make sync m='tu mensaje de commit'"; \
		exit 1; \
	fi
	@echo "⬇️  Pulling cambios..."
	@git pull origin $(BRANCH)
	@echo "📦 Agregando archivos..."
	@git add .
	@echo "✍️  Commiteando: $(m)"
	@git commit -m "$(m)"
	@echo "🚀 Pusheando a origin/$(BRANCH)..."
	@git push origin $(BRANCH)
	@echo "✅ Sincronización completada!"

# ============================================
# COMANDOS DE UTILIDADES
# ============================================

# Limpiar archivos generados
clean:
	@echo "🧹 Limpiando archivos temporales..."
	@rm -rf node_modules .next
	@echo "✅ Limpieza completada!"

# Instalar dependencias
install:
	@echo "📦 Instalando dependencias..."
	@npm install
	@echo "✅ Instalación completada!"

# Fresh start (clean + install + dev)
fresh: clean install
	@echo "🚀 Iniciando servidor..."
	@npm run dev
