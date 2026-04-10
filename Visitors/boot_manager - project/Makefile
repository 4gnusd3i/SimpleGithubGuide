# Kompilator og flagg
CXX = g++
PKG_CFLAGS = $(shell pkg-config --cflags gtk4)
PKG_LIBS = $(shell pkg-config --libs gtk4)

CXXFLAGS = -std=c++17 -Wall -Wextra $(PKG_CFLAGS)
LDFLAGS = $(PKG_LIBS)

# Mål
TARGET = boot_manager
SRC = boot_manager.cpp

# Default mål
all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) -o $@ $^ $(CXXFLAGS) $(LDFLAGS)

# Rydd opp
clean:
	rm -f $(TARGET)

.PHONY: all clean
